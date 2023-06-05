const ProgressBar = (Props: {bgColor: string, completed: any}) => {
  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 50
  }

  const fillerStyles = {
    height: '100%',
    width: `${Props.completed}%`,
    backgroundColor: Props.bgColor,
    borderRadius: 'inherit',

  }

  const labelStyles = {
    padding: 5,
    color: 'red',
    fontWeight: 'bold',
  transition: 'width 1s ease-in-out',
  }
  
  return (
    <div className="h-[20px] w-[70vh]  bg-[#e0e0de] rounded-full m-[50]">
      <div style={fillerStyles}>
        <span style={labelStyles} >{`${Props.completed}%`}</span>
      </div>
    </div>
  )
};
  
export default ProgressBar;