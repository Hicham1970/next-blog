

const TextAreaCompo = ({rows,value, placeholder, onChange, name, label}) => {
  return (
    <div className="space-y-1">
      <label>{label}</label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        className="w-full  bg-white dark:bg-primaryColorLight rounded-lg py-2 px-3"
      />
    </div>
  );
}

export default TextAreaCompo

