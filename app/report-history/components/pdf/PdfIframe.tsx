interface Props {
  reportPath: string;
  key: string;
}

const PdfIframe: React.FC<Props> = ({ reportPath, key }) => {
  if (!reportPath) return <p>No report available</p>;
  const timestamp = new Date().getTime();
  const srcWithTimestamp = `${reportPath}?t=${timestamp}`;
  return (
    <iframe
      key={key}
      src={srcWithTimestamp}
      width="100%"
      height="600px"
      style={{ border: "none" }}
    />
  );
};

export default PdfIframe;
