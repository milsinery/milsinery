import pic1 from '../pictures/records/stageManager/picture1.jpeg';
import pic2 from '../pictures/records/stageManager/picture2.jpeg';

const data = {
  title: 'Stage Manager',
  description:
    'Most of all in the new macOS ventura I like the new feature — Stage Manager. ',
  infoLink: '/blog/stage-manager',
  meta: {
    title: 'Stage Manager',
    content: 'Most of all in the new macOS ventura I like the new feature — Stage Manager. ',
  },
  content: [
    {
      type: 'picture',
      content: pic1,
    },
    {
      type: 'picture',
      content: pic2,
    },
    {
      type: 'text',
      content:
        'Most of all in the new macOS ventura I like the new feature — Stage Manager. ',
    },
    {
      type: 'text',
      content:
        'Now, on the left side of the screen, you can display a list of currently used programs with a dynamic preview. ',
    },
    {
      type: 'text',
      content:
        'In fact, this is a continuation of the idea of "recently used programs" in the Dock, which I immediately turned off because I did not understand how it worked. In my opinion, it only created a mess in the Dock. ',
    },
    {
      type: 'text',
      content:
        'The new solution seems more informative and looks cool. At the same time, the new solution works great with Mission Control, which displays all open programs on the screen. ',
    }, 
    {
      type: "link",
      link: "https://www.apple.com/macos/ventura", 
      content: "About Stage Manager and other features"
    }
  ],
};

export default data;
