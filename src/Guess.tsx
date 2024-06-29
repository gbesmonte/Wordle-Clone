export default function Guess(props) {
  const letterObjs = props.letterObjs;
  //console.log(letterObjs);
  return (
    <>
      <div className="guess">
        {letterObjs.map((x, i) => (
          <div key={i} className="letter" style={{ backgroundColor: x.color }}>
            {letterObjs[i].text.toUpperCase()}
          </div>
        ))}
      </div>
    </>
  );
}
