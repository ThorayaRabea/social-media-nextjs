export type AuthState = {
  userToken: string | null;
  userData: UserType | null;
  isError: string | null;
  isLoading: boolean;
  myProfile: MyProfileType | null;
  myPosts: MyPostsResponse | null;
  followSuggestions: FollowSuggestionsResponse | null;
  followUserAndUnfollow: FollowAndUnfollowUserResponse | null;
  userProfile: UserProfileResponse | null;
  postCreated: PostCreatedResponse | null;
  updatePost: UpdatePostResponse | null;
  deletePost: DeletePostResponse | null;
  likeAndUnlikePost: LikeAndUnlikePostResponse | null;
  sharePost: SharePostResponse | null;
  createComment: CreatedCommentResponse | null;
  commnetsReply: commnetsReplyResponse | null;
  createReplyComment: createReplyCommentResponseType | null;
  updateComment: UpdateCommentResponse | null;
  deleteComment: DeleteCommentResponse | null;
  likeAndUnlikeComment: LikeAndUnlikeCommentResponse | null;
  allNotification: NotificationResponse | null;
  unreadNotificationsCount: UnreadNotificationResponse | null;
}

export type CreatePostPayload = {
  body: string;
  image?: File;
}

export type PostType = {
  _id: string;
  body: string;
  image?: string;
  user: UserType;
  sharedPost: SharedPost | null;
  likes: [];
  createdAt: string;
  commentsCount: number;
  topComment?: TopCommentType;
  sharesCount: number;
  likesCount: number;
  isShare?: boolean;
  privacy?: string;
  id?: string;
};

export type CommentItemProps = {
  comment: comments | CreatedCommentType | any;
  isTopComment?: boolean;
  isReply?: boolean;
  onDeleteReply?: (replyId: string) => void;
};
export type comments = {
  _id: string;
  content: string;
  commentCreator: UserType;
  post: string;
  createdAt: string;
  repliesCount: number;
};
export type UserType = {
  _id: string;
  id?: string;
  name: string;
  photo: string;
};

export type TopCommentType = {
  _id: string;
  content: string;
  commentCreator: UserType;
  post: string;
  likes: [];
  createdAt: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  dateOfBirth: string;
  gender: string;
}
export type SignUpResponse = {
  success: boolean;
  message: string;
}
export type LoginPayload = {
  email: string;
  password: string;
}
export type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
  data?: {
    token?: string;
  };
}

export type ChangePasswordType = {
  password: string;
  newPassword: string;
}
export type MyData = {
  user: MyProfileType
}

export type MyProfileType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  cover: string;
  followersCount: number;
  followingCount: number;
  id: string;
}
export type MyProfileResponse = {
  success: boolean;
  message: string;
  data: MyData;
}

export type MyPostsData = {
  posts: PostType[];
}

export type MyPostsResponse = {
  success: boolean;
  message: string;
  data: MyPostsData;
}

export type UserSuggestionType = {
  _id: string;
  name: string;
  username: string;
  photo: string;
  mutualFollowersCount: number;
  followersCount: number;
}

export type FollowSuggestionsData = {
  suggestions: UserSuggestionType[];
}

export type FollowSuggestionsResponse = {
  success: boolean;
  message: string;
  data: FollowSuggestionsData;
}

export type FollowAndUnfollowUserResponse = {
  success: boolean;
  message: string;
  data: {
    following: boolean,
    followersCount: number,

  }
}

export type UserProfile = {
  _id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  cover: string;
  followers: Follower[];
  following: Follower[];
  createdAt: string;
  followersCount: number;
  followingCount: number;
  id: string;
}

export type Follower = {
  _id: string;
  name: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  id: string;
}

export type UserProfileResponse = {
  success: boolean;
  message: string;
  data: {
    isFollowing: boolean;
    user: UserProfile;
  };
}

export type PostCreatedData = {
  post: PostType;
}

export type PostCreatedResponse = {
  success: boolean;
  message: string;
  data: PostCreatedData;
}
export type UpdatePostType = {
  _id: string;
  body: string;
  privacy: string,
  user: string,
  sharedPost: null,
  likes: [
    string
  ],
  createdAt: string,
  image: string,
  likesCount: number,
  isShare: boolean,
  id: string
}
export type UpdatePostResponse = {
  success: boolean;
  message: string;
  data: {
    post: UpdatePostType;
  }
}

export type DeletePostResponse = {
  success: boolean;
  message: string;
  data: {
    post: UpdatePostType;
  }
}
export type LikeAndUnlikePostResponse = {
  success: boolean;
  message: string;
  data: {
    like: boolean;
    likesCount: number;
    post: PostType;

  }
}

interface PostUser {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

export type SharedPost = {
  _id: string;
  body: string;
  privacy: "public" | "private" | "friends";
  user: PostUser;
  sharedPost: null | SharedPost;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: null | string;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}

export type Post = {
  _id: string;
  body: string;
  privacy: "public" | "private" | "friends";
  user: PostUser;
  sharedPost: SharedPost | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: null | string;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
}

export type SharePostResponse = {
  success: boolean;
  message: string;
  data: {
    post: Post;
  };
}

export type CreatedCommentType = {
  _id: string;
  content: string;
  image: string;
  commentCreator: UserType;
  post: string;
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
}

export type CreatedCommentResponse = {
  success: boolean;
  message: string;
  data: {
    comment: CreatedCommentType;
  };
}

export type commnetsReplyResponse = {
  success: boolean;
  message: string;
  data: {
    reply: CreatedCommentType;
  };
}

export type createReplyCommentResponseType = {
  success: boolean;
  message: string;
  data: {
    reply: CreatedCommentType;
  };
}

export type UpdateCommentResponse = {
  success: boolean;
  message: string;
  data: {
    comment: CreatedCommentType;
  };
}
export type DeleteCommentResponse = {
  success: boolean;
  message: string;
  data: {};
}

export type LikeAndUnlikeCommentResponse = {
  success: boolean;
  message: string;
  data: {
    like: boolean;
    likesCount: number;
    comment: CreatedCommentType;

  }
}


export type NotificationResponse = {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
  }
}
export type Notification = {
  _id: string,
  recipient: UserType,

}
export type UnreadNotificationResponse = {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  }
}
