import App from '../app';
import AppsData from '../../data/appsData';
import './index.css';

const AppList = () => {
  return (
    <>
      <section className="appList">
        {AppsData.map((item, key) => {
          return (
            <App
              webp={item.webp}
              png={item.webp}
              name={item.name}
              info={item.info}
              installLink={item.installLink}
              infoLink={item.infoLink}
              aboutLink={item.aboutLink}
              comment={item.comments}
              isNewLabel={item.isNewLabel}
              key={key}
            ></App>
          );
        })}
      </section>
    </>
  );
};

export default AppList;
