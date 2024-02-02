import { FaCheckCircle } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { IoIosCreate } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export default function Help() {
  const navigate = useNavigate();
  return (
    <div className="box">
      <div className="modal">
        <div className="textBox">
          <div className="topRow">
            <h2>How to Play</h2>
          </div>
          <div className="row">
            <div className="helpIcon">
              <FaCheckCircle />
            </div>
            <div className="helpText">
              <h4>Complete quizzes.</h4>
            </div>
          </div>
          <div className="row">
            <div className="helpIcon">
              <BsGraphUp />
            </div>
            <div className="helpText">
              <h4>Check your stats.</h4>
            </div>
          </div>
          <div className="row">
            <div className="helpIcon">
              <IoIosCreate />
            </div>
            <div className="helpText">
              <h4>
                Create your own quizzes to share and challenge your friends!
              </h4>
            </div>
          </div>
        </div>
        <p className="textLink" onClick={() => navigate('/')}>
          Take a quiz!
        </p>
      </div>
    </div>
  );
}
