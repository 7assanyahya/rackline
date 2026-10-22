import Icon from './Icon.jsx';

export const AUTHOR = 'Hassan Yahya';
export const INSTAGRAM = 'v3h3';
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM}/`;

/* "By Hassan Yahya · @v3h3" — shown in the library footer and the phone More sheet */
export default function Credits({ className = 'credits' }) {
  return (
    <p className={className}>
      <span>By</span> <b data-notr="" dir="ltr">{AUTHOR}</b>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-notr="" aria-label={`Instagram @${INSTAGRAM}`}>
        <Icon name="instagram" className="ico sm" /><span dir="ltr">@{INSTAGRAM}</span>
      </a>
    </p>
  );
}
