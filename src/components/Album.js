import React, { Component } from 'react';
import albumData from './../data/albums';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      isHovering: null,
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
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
        <tr key = {index} onClick={() => this.handleSongClick(song)} onMouseEnter = {() => this.mouseEnter(index)} onMouseLeave = {() => this.mouseLeave()}>
        <td id = "song-number"> {this.handleHover(song, index)} </td>
        <td id = "song-title"> {song.title}</td>
        <td id = "song-duration>"> {song.duration} </td>
        </tr>)}
        </tbody>
        </table>
        </section>
      );
    }
  }

  export default Album;
