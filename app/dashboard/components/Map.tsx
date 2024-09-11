const Map = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.9185124462!2d2.347035!3d48.85885484999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sen!2s!4v1726065126928!5m2!1sen!2s"
      width="945"
      height="600"
      className="mt-2"
      style={{ border: "0", borderRadius: "10px" }}
      allowFullScreen={true}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default Map;
