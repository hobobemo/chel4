import { defineStore } from 'pinia';

export const useLeagueStore = defineStore('league', {
  state: () => {
    return {
      leagueSet: false,
      leagueId: null,
      name: null,
      seasons: [],
      divisions: [],
      teams: [],
      trophies: [],
      schedules: [],
    }
  },
  getters: {
    getLeague(state){
      return state.leagueSet;
    },
    getLeagueId(state){
      return state.leagueId;
    },
    getLeagueName(state){
      return state.name;
    },
    getSeasons(state){
      return state.seasons;
    },
    getSeasonsMenu(state) {
      return state.seasons.map(item => ({
        label: item.name,
        value: item.id
      }));
    },
    getSeasonCount(state){
      return state.seasons.length;
    },
    getDivisions(state){
      return state.divisions;
    },
    getDivisionMenu(state) {
      return state.divisions.map(item => ({
        label: item.name,
        value: item.id
      }));
    },
    getDivisionCount(state){
      return state.divisions.length;
    },
    getTeams(state){
      return state.teams;
    },
    getTeamsMenu(state) {
      return state.teams.map(item => ({
        label: item.name,
        value: item.clubId
      }));
    },
    getTeamCount(state){
      return state.teams.length;
    },
    getTeamByClubId: (state) => (clubId) => {
      return state.teams.find(team => team.clubId === clubId);
    },
    getActiveTeams(state) {
      return state.teams.filter(team => team.isActive === 1)
    },
    getTrophies(state){
      return state.trophies;
    },
    getTrophiesMenu(state) {
      return state.trophies.map(item => ({
        label: item.name,
        value: item.id
      }));
    },
    getTrophyCount(state){
      return state.trophies.length;
    },
    getSchedule(state){
      return state.schedules;
    },
    getScheduleCount(state){
      return state.schedules.length;
    },
  },
  actions: {
    async setLeague(item: object){
      this.leagueId = item.id;
      this.name = item.label;
      this.leagueSet = true;

      const divisions = await $fetch(`/api/league/divisions?leagueId=${item.id}`);
      this.divisions = divisions;

      const seasons = await $fetch(`/api/league/seasons?leagueId=${item.id}`);
      this.seasons = seasons;

      const teams = await $fetch(`/api/league/teams?leagueId=${item.id}`);
      this.teams = teams;

      const trophies = await $fetch(`/api/league/trophies?leagueId=${item.id}`);
      this.trophies = trophies;
    },
    unSetLeague(){
      this.leagueSet = false
      this.leagueId = null
      this.name = null
      this.seasons = []
      this.divisions = []
      this.teams = []
      this.trophies = []
      this.schedules = []
    },
    addDivision(id: Number, item: object){
      const newItem = {
        id: id,
        ...item
      }
      this.divisions.push(newItem);
    },
    editDivision(updated: { id: any; [key: string]: any }) {
      const index = this.divisions.findIndex(item => item.id === updated.id);
      if (index !== -1) {
        this.divisions[index] = {
          ...this.divisions[index],
          ...updated
        };
      }
    },
    deleteDivision(id: any) {
      this.divisions = this.divisions.filter(item => item.id !== id);
    },
    addSeason(id: number, item: object) {
      const newItem = {
        id: id,
        ...item
      };
      this.seasons.push(newItem);
    },
    editSeason(updated: { id: any; [key: string]: any }) {
      const index = this.seasons.findIndex(item => item.id === updated.id);
      if (index !== -1) {
        this.seasons[index] = {
          ...this.seasons[index],
          ...updated
        };
      }
    },
    deleteSeason(id: any) {
      this.seasons = this.seasons.filter(item => item.id !== id);
    },
    addTeam(id: number, item: object) {
      const newItem = {
        id: id,
        ...item
      };
      this.teams.push(newItem);
    },
    editTeam(updated: { id: any; [key: string]: any }) {
      const index = this.teams.findIndex(item => item.id === updated.id);
      if (index !== -1) {
        this.teams[index] = {
          ...this.teams[index],
          ...updated
        };
      }
    },
    deleteTeam(id: any) {
      this.teams = this.teams.filter(item => item.id !== id);
    },
    addTrophy(id: Number, item: object){
      const newItem = {
        id: id,
        ...item
      }
      this.trophies.push(newItem);
    },
    editTrophy(updated: { id: any; [key: string]: any }) {
      const index = this.trophies.findIndex(item => item.id === updated.id);
      if (index !== -1) {
        this.trophies[index] = {
          ...this.trophies[index],
          ...updated
        };
      }
    },
    deleteTrophy(id: any) {
      this.trophies = this.trophies.filter(item => item.id !== id);
    },
  },
})