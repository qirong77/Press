export const FilesIcon = (props: JSX.IntrinsicElements['button']) => {
    return (
      <IconContainer {...props}>
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2860">
          <path
            d="M256 256a128 128 0 0 0-128 128v426.666667a128 128 0 0 0 128 128h341.333333a128 128 0 0 0 128-128v-42.666667h-64v42.666667a64 64 0 0 1-64 64H256A64 64 0 0 1 192 810.666667V384A64 64 0 0 1 256 320h42.666667V256H256z"
            fill="currentColor"
            p-id="2861"></path>
          <path
            d="M672.298667 85.333333c3.498667 0 6.954667 0.128 10.368 0.426667V85.333333a102.997333 102.997333 0 0 1 72.832 30.165334l110.336 110.336A102.997333 102.997333 0 0 1 896 298.666667h-0.426667c0.298667 3.413333 0.426667 6.869333 0.426667 10.368V640a128 128 0 0 1-128 128h-341.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h245.632z m0 64H426.666667A64 64 0 0 0 362.666667 213.333333v426.666667a64 64 0 0 0 64 64h341.333333a64 64 0 0 0 64-64V309.034667A64 64 0 0 0 831.146667 298.666667H768a85.333333 85.333333 0 0 1-85.333333-85.333334V150.186667a64 64 0 0 0-10.368-0.853334zM746.666667 197.162667V213.333333a21.333333 21.333333 0 0 0 21.333333 21.333334h16.170667l-37.504-37.504z"
            fill="currentColor"
            p-id="2862"></path>
        </svg>
      </IconContainer>
    )
  }
  export const Arrow = (props: JSX.IntrinsicElements['button']) => {
    return (
      <IconContainer {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16">
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
        </svg>
      </IconContainer>
    )
  }
  export const FolderCloseIcon = (props: JSX.IntrinsicElements['button']) => {
    return (
      <IconContainer {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16">
          <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"></path>
        </svg>
      </IconContainer>
    )
  }
  export const FolderOpenIcon = (props: JSX.IntrinsicElements['button']) => {
    return (
      <IconContainer {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16">
          <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"></path>
        </svg>
      </IconContainer>
    )
  }
  function IconContainer(props: JSX.IntrinsicElements['button']) {
    return (
      <button
        {...props}
        className={
          '[&>svg]:w-full flex justify-center items-center rounded  hover:cursor-pointer' +
            ' ' +
            props.className || ''
        }>
        {props.children}
      </button>
    )
  }
  