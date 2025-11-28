"""
Email Templates - Pre-built email templates
"""

from typing import Dict, Any
from string import Template


class EmailTemplates:
    """Collection of email templates"""
    
    # Job Application Template
    JOB_APPLICATION = Template("""
Dear Hiring Manager,

I am writing to express my strong interest in the $role position at $company.

$intro_paragraph

$experience_paragraph

$closing_paragraph

Thank you for considering my application. I look forward to discussing how I can contribute to $company.

Best regards,
$name
""")
    
    # Sponsorship Template
    SPONSORSHIP = Template("""
Dear $recipient,

I am reaching out regarding potential sponsorship opportunities with $company.

$intro_paragraph

$value_proposition

$call_to_action

I would appreciate the opportunity to discuss this further.

Best regards,
$name
""")
    
    # Freelance Template
    FREELANCE = Template("""
Hello,

I noticed that $company might benefit from $service. 

$intro_paragraph

$portfolio_highlight

$call_to_action

Looking forward to your response.

Best regards,
$name
""")
    
    @classmethod
    def get_template(cls, template_type: str) -> Template:
        """
        Get email template by type
        
        Args:
            template_type: Type of template (job_application, sponsorship, freelance)
            
        Returns:
            Template object
        """
        templates = {
            "job_application": cls.JOB_APPLICATION,
            "sponsorship": cls.SPONSORSHIP,
            "freelance": cls.FREELANCE
        }
        return templates.get(template_type, cls.JOB_APPLICATION)
    
    @classmethod
    def fill_template(cls, template_type: str, data: Dict[str, Any]) -> str:
        """
        Fill template with data
        
        Args:
            template_type: Type of template
            data: Data to fill template
            
        Returns:
            Filled template string
        """
        template = cls.get_template(template_type)
        return template.safe_substitute(**data)
