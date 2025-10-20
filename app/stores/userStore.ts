import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isAuth: true,
      id: '238816380596649985',
      avatar: null,
      email: null,
      globalName: null,
      username: null,
      connections: [],
      guilds: [],
      leagues: [],
      level: 0,
      customerId: null,
      token: 'c2hhMjU2OjYzMjo5NjNhMGQxN2QyMzgzMjcxZGI3MGIwYWJkODRmYWI4YjFjYWUzNWRmNmNkOGQyMGUxOTBjYjRmNGZhNTMyZDRi'
    }
  },
  getters: {
    getAuth(state){
      return state.isAuth;
    },
    getId(state){
      return state.id;
    },
    getAvatar(state){
      return state.avatar;
    },
    getEmail(state){
      return state.email;
    },
    getGlobalName(state){
      return state.globalName;
    },
    getUsername(state){
      return state.username;
    },
    getConnections(state){
      return state.connections;
    },
    getGuilds(state){
      return state.guilds;
    },
    getLevel(state){
      return state.level;
    },
    getCustomerId(state){
      return state.customerId;
    },
    getToken(state){
      return state.token;
    },
    getLeagues(state){
      return state.leagues;
    },
    getConsoleConnections(state) {
      return state.connections.filter(conn => 
        ['xbox', 'psn', 'playstation'].includes(conn.type.toLowerCase())
      )
    }
  },
  actions: {
    setUser(user: object, connections: object, guilds: object, customerId: any){
      this.id = user.id;
      this.avatar = user.avatar;
      this.email = user.email;
      this.globalName = user.global_name;
      this.username = user.username;
      this.customerId = customerId;

      connections.forEach(connection => {
        this.connections.push(connection);
      });

      for (const guild of guilds) {
        const perms = decodePermissions(guild.permissions_new);
        if (!perms) {
          continue; // Skip this iteration and go to the next
        }
        this.guilds.push(guild);
      }

      if(this.id){
        this.isAuth = true;
      }
    },
    setUserLeagues(leagues){
      this.leagues = leagues;
    },
    removeUser(){
      this.id = null;
      this.avatar = null;
      this.email = null;
      this.globalName = null;
      this.username = null;
      this.connections = [];
      this.guilds = [];
      this.leagues = [];
      this.isAuth = false;
      this.level = 0;
      this.customerId = null;
    },
  },
  persist: true
})