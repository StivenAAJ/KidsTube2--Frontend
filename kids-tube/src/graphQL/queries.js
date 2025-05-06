import gql from 'graphql-tag'

// Consultas para Videos
export const GET_VIDEOS = gql`
  query GetVideos {
    videos {
      _id
      title
      videoUrl
      description
    }
  }
`;

export const GET_VIDEO = gql`
  query GetVideo($id: ID!) {
    video(id: $id) {
      _id
      title
      videoUrl
      description
    }
  }
`;

// Consultas para Playlists
export const GET_PLAYLISTS = gql`
  query GetPlaylists {
    playlists {
      _id
      name
      profiles {
        _id
        fullName
        avatar
      }
      videos {
        _id
        title
        videoUrl
        description
      }
    }
  }
`;

export const GET_PLAYLIST = gql`
  query GetPlaylist($id: ID!, $searchQuery: String) {
    playlist(id: $id) {
      _id
      name
      videos(searchQuery: $searchQuery) {
        _id
        title
        videoUrl
        description
      }
    }
  }
`;

export const GET_PLAYLISTS_BY_PROFILE = gql`
  query GetPlaylistsByProfile($profileId: ID!) {
    playlistsByProfile(profileId: $profileId) {
      _id
      name
      videos {
        _id
        title
        videoUrl
        description
      }
    }
  }
`;

// Consultas para Usuarios Restringidos
export const GET_RESTRICTED_USERS = gql`
  query GetRestrictedUsers {
    restrictedUsers {
      _id
      fullName
      pin
      avatar
      parentAccount {
        _id
        email
        first_name
        last_name
      }
    }
  }
`;

export const GET_RESTRICTED_USERS_BY_PARENT = gql`
  query GetRestrictedUsersByParent($parentAccount: ID!) {
    restrictedUsersByParent(parentAccount: $parentAccount) {
      _id
      fullName
      pin
      avatar
      parentAccount {
        _id
        email
        first_name
        last_name
      }
    }
  }
`;
