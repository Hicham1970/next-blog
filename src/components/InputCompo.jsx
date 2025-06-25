import React from 'react'

const InputCompo = ({type,value, placeholder, onChange, name, label}) => {
  return (
    <div className="space-y-1">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        className="w-full  bg-white dark:bg-primaryColorLight rounded-lg py-2 px-3"
      />
    </div>
  );
}

export default InputCompo
