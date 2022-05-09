import Extension from '../extension';
import ExtensionsData from '../../data/extensionsData';
import './index.css';

const ExtensionsList = () => {
  return (
    <>
      <section className="pluginsList">
        {ExtensionsData.map((item, key) => {
          return (
            <Extension
              webp={item.webp}
              png={item.webp}
              name={item.name}
              info={item.info}
              installLink={item.installLink}
              infoLink={item.infoLink}
              comment={item.comments}
              isNewLabel={item.isNewLabel}
              key={key}
            ></Extension>
          );
        })}
      </section>
    </>
  );
};

export default ExtensionsList;
