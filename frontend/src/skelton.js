import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';
import ReactPlaceholder from 'react-placeholder';

const GhostPlaceholder = () => (
  <div className='my-placeholder'>
    <RectShape color='gray' style={{width: 25, height: 70}} />
    <TextBlock rows={6} color='blue'/>
  </div>
);
<ReactPlaceholder ready={ready} customPlaceholder={<GhostPlaceholder />}>
  <MyComponent />
</ReactPlaceholder>

export default GhostPlaceholder;