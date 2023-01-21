import pic1 from '../pictures/records/renamerFirst1000/picture1.jpg';

const data = {
  title: 'The first 1000',
  description:
    'People use Renamer - it’s cool. ',
  infoLink: '/blog/renamer-the-first-1000',
  meta: {
    title: 'The first 1000',
    content: 'People use Renamer - it’s cool',
  },
  content: [
    {
      type: 'picture',
      content: pic1,
    },
    {
      type: 'text',
      content:
        'People use Renamer - it’s cool. And now the Renamer has a new icon and cover. ',
    },
    {
      type: 'text',
      content:
        'Thank you all! ❤️',
    },
    {
      type: "link",
      link: "https://www.figma.com/community/plugin/1185219382747213717", 
      content: "Renamer in Figma Community"
    }
  ],
};

export default data;
