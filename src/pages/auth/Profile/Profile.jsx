
import PostList from '../../../components/posts/PostList';
import ProfileCard from './../../../components/ProfileCard/ProfileCard';

export default function Profile() {
  return (
    <>
     
        <ProfileCard />
        <PostList fromHome={false} />
     
    </>
  );
}
