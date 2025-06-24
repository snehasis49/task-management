from typing import List
import logging
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.llm = None
        if settings.groq_api_key and settings.groq_api_key != 'test-key':
            try:
                self.llm = ChatGroq(
                    groq_api_key=settings.groq_api_key,
                    model_name="llama3-8b-8192",  # Known working model
                    temperature=0.3,
                    max_tokens=1000,
                    timeout=30,
                    max_retries=2
                )
                logger.info("LangChain ChatGroq with Llama model initialized successfully")
            except Exception as e:
                logger.warning(f"Could not initialize ChatGroq client: {e}")

    async def generate_tags(self, title: str, description: str) -> List[str]:
        """Generate tags using LangChain ChatGroq with DeepSeek model"""
        if not self.llm:
            logger.info("ChatGroq client not available, using fallback tag generation")
            return self._generate_fallback_tags(title, description)

        try:
            # Create system and human messages for better context
            system_message = SystemMessage(content="""You are an expert at analyzing software development tasks and generating relevant tags.
Generate 3-5 concise, relevant tags that categorize the task based on:
- Technology/Platform (UI, API, Database, Frontend, Backend, Mobile, etc.)
- Type (Bug, Feature, Enhancement, Task, etc.)
- Priority/Severity (Critical, High, Medium, Low if applicable)
- Component (Authentication, Performance, Security, etc.)

IMPORTANT: Return ONLY the tags as a comma-separated list. Do not include any reasoning, explanations, or thinking process. Just the tags.
Example: UI, Bug, Critical, Authentication""")

            human_message = HumanMessage(content=f"""Analyze this task and generate relevant tags:

Title: "{title}"
Description: "{description}"

Tags:""")

            # Generate response using LangChain
            response = await self.llm.ainvoke([system_message, human_message])
            tags_text = response.content.strip()

            # Handle DeepSeek reasoning tokens - extract content after </think>
            if "<think>" in tags_text and "</think>" in tags_text:
                # Extract the actual response after the reasoning
                tags_text = tags_text.split("</think>")[-1].strip()

            # Clean and validate tags
            tags = []
            for tag in tags_text.split(','):
                cleaned_tag = tag.strip().strip('"\'')
                if cleaned_tag and len(cleaned_tag) <= 20:  # Reasonable tag length limit
                    tags.append(cleaned_tag)

            # Ensure we have valid tags
            if tags and len(tags) <= 5:
                logger.info(f"Generated AI tags with Llama: {tags}")
                return tags
            else:
                logger.warning(f"AI generated invalid tags: {tags_text}, using fallback")
                return self._generate_fallback_tags(title, description)

        except Exception as e:
            logger.error(f"Error generating AI tags with Llama: {e}")
            return self._generate_fallback_tags(title, description)

    def _generate_fallback_tags(self, title: str, description: str) -> List[str]:
        """Generate tags using intelligent analysis when AI is not available"""
        text = f"{title} {description}".lower()
        tags = []

        # Extract meaningful words (remove common stop words)
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'}

        # Split text into words and filter
        words = [word.strip('.,!?;:"()[]{}') for word in text.split()]
        meaningful_words = [word for word in words if len(word) > 2 and word not in stop_words]

        # Priority keyword mappings for common categories
        priority_mappings = {
            'UI': ['ui', 'interface', 'button', 'form', 'display', 'layout', 'design', 'visual', 'screen', 'page'],
            'Performance': ['slow', 'performance', 'speed', 'lag', 'timeout', 'loading', 'optimization', 'memory'],
            'API': ['api', 'endpoint', 'request', 'response', 'server', 'service', 'rest', 'graphql'],
            'Database': ['database', 'db', 'query', 'data', 'sql', 'mongodb', 'collection', 'schema'],
            'Authentication': ['login', 'auth', 'password', 'user', 'session', 'token', 'security', 'access'],
            'Frontend': ['frontend', 'react', 'javascript', 'css', 'html', 'component', 'jsx', 'vue', 'angular'],
            'Backend': ['backend', 'server', 'python', 'fastapi', 'node', 'express', 'django', 'flask'],
            'Mobile': ['mobile', 'phone', 'android', 'ios', 'responsive', 'tablet', 'device'],
            'Security': ['security', 'vulnerability', 'xss', 'injection', 'csrf', 'encryption', 'ssl'],
            'Critical': ['critical', 'crash', 'error', 'broken', 'fail', 'urgent', 'blocker'],
            'Bug': ['bug', 'issue', 'problem', 'error', 'defect', 'fix', 'broken'],
            'Feature': ['feature', 'enhancement', 'improvement', 'new', 'add', 'implement'],
            'Testing': ['test', 'testing', 'unit', 'integration', 'qa', 'quality']
        }

        # Check for priority categories first
        for tag, keywords in priority_mappings.items():
            if any(keyword in text for keyword in keywords):
                tags.append(tag)

        # If no priority tags found, try to extract meaningful tags from the text
        if not tags:
            # Look for technical terms that could be tags
            tech_terms = []
            for word in meaningful_words:
                if len(word) > 3 and word.isalpha():
                    # Capitalize first letter for tag format
                    tech_terms.append(word.capitalize())

            # Take up to 3 most relevant terms
            tags.extend(tech_terms[:3])

        # Ensure we have at least one tag
        if not tags:
            tags = ['General']

        return tags[:5]  # Limit to 5 tags

    async def generate_description(self, title: str) -> str:
        """Generate a detailed description based on task title using LangChain ChatGroq with Llama"""
        if not self.llm:
            logger.info("ChatGroq client not available, using fallback description generation")
            return self._generate_fallback_description(title)

        try:
            # Create system and human messages for better context
            system_message = SystemMessage(content="""You are an expert technical writer and project manager. Generate comprehensive, professional task descriptions that include:

1. Clear problem statement or objective
2. Specific requirements and acceptance criteria
3. Technical considerations when applicable
4. Expected outcomes and deliverables
5. Implementation guidelines

Format the response in clean Markdown (not HTML). Use:
- #, ##, ### for headings
- - or * for lists
- ** for bold
- _ for italics
- Backticks for code if needed
- Keep it between 150-400 words
- Make it actionable and specific

IMPORTANT: Return ONLY the Markdown content. Do not include any reasoning, thinking process, or explanations. Just the formatted Markdown description.""")

            human_message = HumanMessage(content=f"""Generate a detailed task description for:

Title: "{title}"

Description:""")

            # Generate response using LangChain
            response = await self.llm.ainvoke([system_message, human_message])
            description = response.content.strip()

            # Handle DeepSeek reasoning tokens - extract content after </think>
            if "<think>" in description and "</think>" in description:
                # Extract the actual response after the reasoning
                description = description.split("</think>")[-1].strip()

            # Basic validation and cleaning
            if description and len(description) > 50:  # Ensure meaningful content
                logger.info(f"Generated AI description with Llama for title: {title[:50]}...")
                return description
            else:
                logger.warning(f"AI generated insufficient description, using fallback")
                return self._generate_fallback_description(title)

        except Exception as e:
            logger.error(f"Error generating AI description with Llama: {e}")
            return self._generate_fallback_description(title)

    def _generate_fallback_description(self, title: str) -> str:
        """Generate a basic description when AI is not available"""
        # Create a simple template-based description
        title_lower = title.lower()

        if any(word in title_lower for word in ['bug', 'issue', 'error', 'problem', 'fix']):
            return f"""<p><strong>Issue Description:</strong></p>
<p>This task involves investigating and resolving the issue: "{title}"</p>

<p><strong>Requirements:</strong></p>
<ul>
<li>Identify the root cause of the problem</li>
<li>Implement a proper solution</li>
<li>Test the fix thoroughly</li>
<li>Document the resolution</li>
</ul>

<p><strong>Acceptance Criteria:</strong></p>
<ul>
<li>Issue is completely resolved</li>
<li>No regression in existing functionality</li>
<li>Solution is properly tested</li>
</ul>"""

        elif any(word in title_lower for word in ['feature', 'add', 'implement', 'create', 'new']):
            return f"""<p><strong>Feature Description:</strong></p>
<p>This task involves implementing the new feature: "{title}"</p>

<p><strong>Requirements:</strong></p>
<ul>
<li>Design and implement the feature according to specifications</li>
<li>Ensure proper integration with existing system</li>
<li>Write comprehensive tests</li>
<li>Update documentation as needed</li>
</ul>

<p><strong>Acceptance Criteria:</strong></p>
<ul>
<li>Feature works as expected</li>
<li>All tests pass</li>
<li>Code follows project standards</li>
<li>Documentation is updated</li>
</ul>"""

        else:
            return f"""<p><strong>Task Description:</strong></p>
<p>This task involves: "{title}"</p>

<p><strong>Requirements:</strong></p>
<ul>
<li>Complete the specified task according to requirements</li>
<li>Ensure quality and adherence to standards</li>
<li>Test the implementation thoroughly</li>
<li>Document any changes or decisions</li>
</ul>

<p><strong>Acceptance Criteria:</strong></p>
<ul>
<li>Task is completed successfully</li>
<li>Quality standards are met</li>
<li>Proper testing is conducted</li>
</ul>"""


# Singleton instance
ai_service = AIService()
