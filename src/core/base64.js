const size = (base64) => {
  const len = base64.replace(/^data:image\/\w+;base64,/, "").length
  return (len - 814) / 1.37
  // return len * 3 / 4
}

const data = (base64) => {
  return base64.replace(/^data:image\/\w+;base64,/, "")
}

const prefix = (ext) => {
  return `data:${ext};base64,`
}

export default { size, data, prefix }
