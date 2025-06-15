from typing import List
import groq
from app.core.config import settings


class AIService:
    def __init__(self):
        self.groq_client = None
        if settings.groq_api_key and settings.groq_api_key != 'test-key':
            try:
                self.groq_client = groq.Groq(api_key=settings.groq_api_key)
            except Exception as e:
                print(f"Warning: Could not initialize Groq client: {e}")

    async def generate_tags(self, title: str, description: str) -> List[str]:
        """Generate tags using Groq AI"""
        if not self.groq_client:
            return self._generate_fallback_tags(title, description)

        try:
            prompt = f"""Identify relevant tags for the following task/bug report. Return 3-5 tags only as a comma-separated list.
Task Title: "{title}"
Description: "{description}"

Focus on:
- Technology/platform (UI, API, Database, Mobile, etc.)
- Severity/priority indicators
- Component/feature area
- Issue type (bug, feature, enhancement, etc.)

Return only the tags, comma-separated, no explanations."""

            response = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192",
                temperature=0.3,
                max_tokens=100
            )
            
            tags_text = response.choices[0].message.content.strip()
            tags = [tag.strip() for tag in tags_text.split(',') if tag.strip()]
            return tags[:5] if tags else self._generate_fallback_tags(title, description)
            
        except Exception as e:
            print(f"Error generating AI tags: {e}")
            return self._generate_fallback_tags(title, description)

    def _generate_fallback_tags(self, title: str, description: str) -> List[str]:
        """Generate tags using keyword matching when AI is not available"""
        text = f"{title} {description}".lower()
        tags = []

        # Define keyword mappings
        keyword_mappings = {
            'UI': ['ui', 'interface', 'button', 'form', 'display', 'layout', 'design'],
            'Performance': ['slow', 'performance', 'speed', 'lag', 'timeout', 'loading'],
            'API': ['api', 'endpoint', 'request', 'response', 'server', 'backend'],
            'Database': ['database', 'db', 'query', 'data', 'sql', 'mongodb'],
            'Authentication': ['login', 'auth', 'password', 'user', 'session', 'token'],
            'Mobile': ['mobile', 'phone', 'android', 'ios', 'responsive'],
            'Security': ['security', 'vulnerability', 'xss', 'sql injection', 'csrf'],
            'Frontend': ['frontend', 'react', 'javascript', 'css', 'html'],
            'Backend': ['backend', 'server', 'python', 'fastapi', 'node'],
            'Critical': ['critical', 'crash', 'error', 'broken', 'fail'],
            'Bug': ['bug', 'issue', 'problem', 'error', 'defect'],
            'Feature': ['feature', 'enhancement', 'improvement', 'new'],
            'Task': ['task', 'todo', 'work', 'implement']
        }

        for tag, keywords in keyword_mappings.items():
            if any(keyword in text for keyword in keywords):
                tags.append(tag)

        return tags[:5] if tags else ['General']


# Singleton instance
ai_service = AIService()
