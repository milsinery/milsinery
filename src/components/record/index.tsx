import { Link } from 'react-router-dom';
import './index.css';

type RecordProps = {
  title: string;
  description: string;
  infoLink: string;
};

const Record = ({ title, description, infoLink }: RecordProps) => {
  return (
    <div className="record">
      <Link className="record__title" to={infoLink}>
        <h2>{title}</h2>
        <p>{description}</p>
      </Link>
    </div>
  );
};

export default Record;
