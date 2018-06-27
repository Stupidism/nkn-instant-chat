import createAsyncComponent from 'modules/createAsyncComponent';

export default createAsyncComponent(() =>
  import(/* webpackChunkName: "components.ChatRoom" */ './ChatRoom'),
);
