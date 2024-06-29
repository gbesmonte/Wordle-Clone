export default function LetterBank(props) {
  const ab = props.alphabet;
  return (
    <>
      <div className="keyboard-vis">
        {ab.map((x, i) => (
          <div
            key={i}
            className="letter-key"
            style={{ backgroundColor: x.color }}
          >
            {x.text.toUpperCase()}
          </div>
        ))}
      </div>
    </>
  );
}
