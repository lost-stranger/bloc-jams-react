import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false,
      isHovering: null,
      volume: 1.0
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

    componentDidMount() {
      this.eventListeners = {
        timeupdate: e => {
          this.setState({ currentTime: this.audioElement.currentTime });
        },
        durationchange: e => {
          this.setState({ duration: this.audioElement.duration });
        },
        volumecontrol: e => {
          this.setState({ volumecontrol: this.audioElement.currentVolume });
        }
      };
      this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
      this.audioElement.addEventListener('volumecontrol', this.eventListeners.volumecontrol);
    }

    componentWillUnmount() {
      this.audioElement.src = null;
      this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
      this.audioElement.removeEventListener('volumecontrol', this.eventListeners.volumecontrol);
    }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
  }

  mouseEnter(index) {
    this.setState({ isHovering : index });
  }

  mouseLeave() {
    this.setState({ isHovering : null });
  }

  handleHover(song, index) {
    const isSameSong = this.state.currentSong === song;

    if (isSameSong && this.state.isPlaying && this.state.isHovering === index) {
      return (<span className = "ion-md-pause" > </span>); //this is working
    }
    if (isSameSong && !this.state.isPlaying && this.state.isHovering === index) {
      return (<span className = "ion-md-play" > </span>); //this is working
    }
    if (!isSameSong && this.state.isHovering === index) {
      return (<span className = "ion-md-play" > </span>); //if we are
    }
    else {
      return (<span> {index+1} </span>);
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
  const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
  const newIndex = Math.min(this.state.album.songs.length, currentIndex + 1);
  const newSong = this.state.album.songs[newIndex];
  this.setSong(newSong);
  this.play();
  }

  handleTimeChange(e) {
  const newTime = this.audioElement.duration * e.target.value;
  this.audioElement.currentTime = newTime;
  this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
  const newVolume = 1 * e.target.value;
  this.audioElement.volume = newVolume;
  this.setState({ volume: newVolume });
  }

  render() {
    return (
      <section className="album">
      <section id="album-info">
      <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
      <div className="album-details">
      <h1 id="album-title">{this.state.album.title}</h1>
      <h2 className="artist">{this.state.album.artist}</h2>
      <div id="release-info">{this.state.album.releaseInfo}</div>
      </div>
      </section>

      <table id="song-list" align = "center">
      <colgroup>
      <col id="song-number-column" />
      <col id="song-title-column" />
      <col id="song-duration-column" />
      </colgroup>
      <tbody>
      <tr>
      <th> # </th>
      <th> Song </th>
      <th> Duration </th>
      </tr>
      {this.state.album.songs.map( ( song, index) =>
        <tr key = {index}
        onClick={() => this.handleSongClick(song)}
        onMouseEnter = {() => this.mouseEnter(index)}
        onMouseLeave = {() => this.mouseLeave()}>
        <td id = "song-number"> {this.handleHover(song, index)} </td>
        <td id = "song-title"> {song.title}</td>
        <td id = "song-duration>"> {song.duration} </td>
        </tr>)}
        </tbody>
        </table>
        <PlayerBar
        isPlaying={this.state.isPlaying}
        currentSong={this.state.currentSong}
        currentTime={this.audioElement.currentTime}
        duration={this.audioElement.duration}
        volume = {this.audioElement.volume}
        handleSongClick={() => this.handleSongClick(this.state.currentSong)}
        handlePrevClick={() => this.handlePrevClick()}
        handleNextClick={() => this.handleNextClick()}
        handleTimeChange={(e) => this.handleTimeChange(e)}
        handleVolumeChange={(e) => this.handleVolumeChange(e)}
        />
        </section>
      );
    }
  }

  export default Album;
