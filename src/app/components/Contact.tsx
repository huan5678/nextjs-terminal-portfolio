import React, { useState, useCallback } from 'react';
import TypingAnimation from './TypingAnimation';

const contactData = [
  {
    icon: '📧',
    label: 'Email',
    value: 'huan5678@gmail.com',
    href: 'mailto:huan5678@gmail.com',
  },
  {
    icon: '🐙',
    label: 'GitHub',
    value: 'github.com/huan5678',
    href: 'https://github.com/huan5678',
  },
  {
    icon: '🔗',
    label: 'LinkedIn',
    value: 'linkedin.com/in/sean-huang-9527-tw',
    href: 'https://linkedin.com/in/sean-huang-9527-tw',
  },
  {
    icon: '📷',
    label: 'Instagram',
    value: '@ah_sean1982',
    href: 'https://www.instagram.com/ah_sean1982',
  },
];

const Contact: React.FC = () =>
{
  const [visibleContacts, setVisibleContacts] = useState(0);
  const [visibleValues, setVisibleValues] = useState(-1);

  const handleLabelComplete = useCallback(() => {
    setVisibleValues(prev => prev + 1);
  }, []);

  const handleValueComplete = useCallback(() => {
    setVisibleContacts(prev => prev + 1);
    setVisibleValues(-1);
  }, []);

  return (
    <div className="flex flex-col space-y-1 font-mono">
      {contactData.map((item, index) => (
        index <= visibleContacts && (
          <div key={index} className="flex flex-row items-center space-x-3">
            <span className="flex-shrink-0">{item.icon}</span>
            <TypingAnimation
              text={`${item.label}:`}
              className="w-20 flex-shrink-0 text-gray-400 text-base font-mono text-left"
              onComplete={index === visibleContacts ? handleLabelComplete : undefined}
            />
            {(index < visibleContacts || (visibleValues >= index && index === visibleContacts)) && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-accent hover:underline flex-shrink min-w-0 break-all"
              >
                <TypingAnimation
                  text={item.value}
                                      className="theme-accent text-base font-mono text-left"
                  onComplete={visibleValues === index ? handleValueComplete : undefined}
                />
              </a>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default Contact;
