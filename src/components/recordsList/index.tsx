import Record from '../record/index';
import getRecords from '../../data/recordsData';
import './index.css';

const RecordList = () => {
  return (
    <>
      <section className="recordList">
        {getRecords().map((item, key) => {
          return (
            <Record
              title={item.title}
              description={item.description}
              infoLink={item.infoLink}
              key={key}
            ></Record>
          );
        })}
      </section>
    </>
  );
};

export default RecordList;
