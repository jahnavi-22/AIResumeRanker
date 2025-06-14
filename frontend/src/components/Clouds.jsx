import cloud from "../assets/cloud.png";

const Clouds = () => {
  return (
    <>
      <img src={cloud} alt="cloud" className="cloud" style={{ top: '5%', animationDelay: '-10s' }} />
      <img src={cloud} alt="cloud" className="cloud" style={{ top: '15%', animationDelay: '-22s' }} />
      <img src={cloud} alt="cloud" className="cloud" style={{ top: '30%', animationDelay: '-5s' }} />
    </>
  );
};

export default Clouds;
