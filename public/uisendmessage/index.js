'use strict';

// class FormCode extends React.Component {
//   render() {

//     return <button onClick={() => this.setState({ liked: true })}>Like</button>;
//   }
// }

const config = {
  apiKey: 'AIzaSyA79muaJwUzTl_KAPqCvY8vrFSUP-U9_VM',
  authDomain: 'communicationtabtesting.firebaseapp.com',
  databaseURL: 'https://communicationtabtesting.firebaseio.com',
  projectId: 'communicationtabtesting',
  storageBucket: 'communicationtabtesting.appspot.com',
  messagingSenderId: '164300920032',
  appId: '1:164300920032:web:9d731f06845a4b9866ac85',
  measurementId: 'G-YEV6REVVVK',
};

class FormCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
    };
    firebase.initializeApp(config);
    const token =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIzMTgzIiwiaXNzIjoiY29tbXVuaWNhdGlvbnRhYnRlc3RpbmdAYXBwc3BvdC5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiY29tbXVuaWNhdGlvbnRhYnRlc3RpbmdAYXBwc3BvdC5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eXRvb2xraXQuZ29vZ2xlYXBpcy5jb20vZ29vZ2xlLmlkZW50aXR5LmlkZW50aXR5dG9vbGtpdC52MS5JZGVudGl0eVRvb2xraXQiLCJleHAiOjE1OTcwNjEzMTAsImlhdCI6MTU5NzA1NzcxMH0.GbYZISNCohB6xMbKI3FTT-DX8bWbmFfjKruA-vWIaxF9Gw_dQHPHbfI-94g40EepMLUhNj_UgrSVnGN1mcToVq98Do3ub9RVjfB9KjU5j59O8yIRWZ_iya5tpF2HtelEHnSpxWnYWgRoxSPh3q8HC9pHMhNoYVA1cp89QFjQsy9VklU-j1lndl_z652PlXoA9hMpZPPC-gZNUhfeOcTE3acbjY_wxonScfQRubw46pGCbp8_zWb2Fbkr1tAUuFnlDAkiugIF0aO0H-hNc28tRAZO72Boxy7kCoH0nSTaGjjLfKwAZS8xhDdgGKnVrwi_lv8Ne5St_zjAPZ_U78JH4A';
    firebase
      .auth()
      .signInWithCustomToken(token)
      .then((user) => {
        console.log('user ', user);
        return user;
      })
      .catch((err) => console.log(err));
    // this.db = firebase.database();
  }

  componentDidMount() {
    // Initialize Firebase
  }

  onChange = (e) => {
    const value = e.target.value;
    this.setState({
      code: value,
    });
  };
  onClick = async (e) => {
    e.preventDefault();
    console.log('click ', firebase);
    const database = firebase.database();
    try {
      await database
        .ref(`1006-Type1/messages`)
        .push({
          userID: `user.id`,
          userName: `user.name`,
          userRole: 'Customer',
          messageType: 'Message',
          messageContent: `message 1006`,
          isRead: [3183],
          sendAt: '',
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    } catch (error) {
      console.log('err', error);
    }
  };

  render() {
    const { code } = this.state;
    return (
      <div>
        <input value={code} type="text" name="code" onChange={this.onChange} />
        <button onClick={this.onClick}>
          <a>Click ho cai coi</a>
        </button>
      </div>
    );
  }
}

ReactDOM.render(<FormCode />, document.getElementById('react_container'));
