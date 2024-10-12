import { getSubscribeLink } from '../../../../PricingPage/payment.links';
import { TierInfoColumn } from './TierInfoColumn';
import { useIsLoggedIn } from '../../../../../lib/useIsLoggedIn';

function TierSection() {
  const isLoggedIn = useIsLoggedIn();
  const subcribeLink = isLoggedIn ? getSubscribeLink() : '/login';


  return (
    <div className="container">
      <section className="section">
        <div className="container">
          <div className="columns">
            <TierInfoColumn
              title="Anonymous"
              description="Works fine for uploads that are under 100 flashcards."
            />
            <TierInfoColumn
              title="Subscriber"
              description="Create 200++ flashcards per upload (500mb)"
              action={{
                text: 'Subscribe',
                link: subcribeLink
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default TierSection;
