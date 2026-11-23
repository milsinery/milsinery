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
  comments?: Array<{ text: string; author: string }>;
  screenshots?: Array<{ webp: string; src: string; alt: string; inFan?: boolean }>;
  isNewLabel: boolean;
  label?: string;
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
              comment={item.comments}
              screenshots={item.screenshots}
              isNewLabel={item.isNewLabel}
              label={item.label}
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
