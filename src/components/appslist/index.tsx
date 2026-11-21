import App from '../app';
import AppsData from '../../data/appsData';
import './index.css';

type AppItem = {
  webp: string;
  png: string;
  name: string;
  info: string;
  installLink?: string;
  infoLink?: string;
  aboutLink?: string;
  comments?: Array<{ text: string; author: string }>;
  isNewLabel: boolean;
  comingSoon?: boolean;
};

const AppList = ({ data = AppsData as AppItem[] }) => {
  return (
    <>
      <div className="appList">
        {data.map((item: AppItem, key: number) => {
          return (
            <App
              webp={item.webp}
              png={item.png}
              name={item.name}
              info={item.info}
              installLink={item.installLink}
              infoLink={item.infoLink}
              aboutLink={item.aboutLink}
              comment={item.comments}
              isNewLabel={item.isNewLabel}
              comingSoon={item.comingSoon}
              key={key}
            ></App>
          );
        })}
      </div>
    </>
  );
};

export default AppList;
