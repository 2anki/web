import { getSubscribeLink } from '../../../../PricingPage/getSubscribeLink';
import { TierInfoColumn } from './TierInfoColumn';
import { getPatreonLink } from '../../../../SettingsPage/getPatreonLink';

const TierSection = function() {

  return <div className="container">
    <section className="section">
      <div className="container">
        <div className="columns">
          <TierInfoColumn title="Anonymous"
                          description="Works fine for uploads that are under 100 flashcards."
          />
          <TierInfoColumn title="Subscriber" description="Create 200 flashcards per upload (100mb)" action={{
            text: 'Subscribe',
            link: getSubscribeLink()
          }} />
          <TierInfoColumn title="Patreon"
                          description="No limits on your uploads (up to 9GB++)" action={{
            text: 'Become a Patron',
            link: getPatreonLink()
          }} />
        </div>
      </div>
    </section>


  </div>;
};

export default TierSection;
