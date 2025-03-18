import {
  getLifetimeLink,
  getSubscribeLink,
} from '../../../../PricingPage/payment.links';
import { TierInfoColumn } from './TierInfoColumn';

interface TierSectionProps {
  isLoggedIn: boolean;
}

function TierSection({ isLoggedIn }: Readonly<TierSectionProps>) {
  const subcribeLink = isLoggedIn ? getSubscribeLink() : '/login';
  const lifetimeLink = getLifetimeLink();

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
                link: subcribeLink,
              }}
            />
            <TierInfoColumn
              title="Lifetime Access"
              description="Forever premium access to 2anki.net"
              action={{
                text: 'Contact us',
                link: lifetimeLink,
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default TierSection;
