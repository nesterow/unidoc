module.exports = {
  suggestions: {
    position: 'absolute',
    minWidth: '400px',
    width: 'inherit',
    minHeight: '60px',
    background: 'white',
    marginTop: '-52px',
    marginLeft: '-6px',
    borderRadius: 6,
    left: 'inherit',
    border: '1px solid #ccc',
    zIndex: 10,
    boxShadow: '0px 0px 4px #666'
  },
  hidden: {
    display: 'none'
  },
  form: {
    zIndex: 100
  },
  results:{
    width: '100%',
    marginTop: 40
  },
  result: {
    color: '#333 !important',
    padding: 24,
    display: 'block',
    textAlign: 'left',
    '& h5': {

    }
  },
  input: {
    border: '2px solid #ccc',
    borderRadius: '6px !important',
    '&:focus': {
      borderRadius: 0,
      borderWidth: '0px !important',
      minWidth: '100%'
    }
  },
  spinner: {
    position: 'absolute',
    right: 8,
    color: '#ccc'
  },
  notFound: {
    marginTop: 50,
    marginBottom: 6,
    color: '#222 !important'
  }
}