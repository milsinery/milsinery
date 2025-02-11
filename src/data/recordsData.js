import Record from '../components/record/index';
import stageManager from '../records/stageManager';
import renamerFirst1000 from '../records/renamerfirst1000';
import badSolutions from '../records/badDesignSolutions';

const records = [
  stageManager,
  renamerFirst1000,
  badSolutions
].reverse();

export const getLastRecord = () => {
  const { title, description, infoLink } = records[0];

  return (
    <Record
      title={title}
      description={description}
      infoLink={infoLink}
    ></Record>
  );
};

export const getRecords = () => records;

export default getRecords;
