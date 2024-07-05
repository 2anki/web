import { PageContainer } from '../../components/styled';
import { getVisibleText } from '../../lib/text/getVisibleText';
import { getSubscribeLink } from './getSubscribeLink';
import { PricingCard } from './components/PricingCard';
import TopMessage from '../../components/TopMessage/TopMessage';
import { useIsLoggedIn } from '../../lib/useIsLoggedIn';

export default function PricingPage() {
  const isLoggedIn = useIsLoggedIn();
  const subcribeLink = isLoggedIn ? getSubscribeLink() : '/login';

  return (
    <PageContainer>
      <div className="container content">
        <section className="section">
          <div className="container">
            <h1 className="title has-text-centered">{getVisibleText('pricing.page.title')}</h1>
            <div className="columns is-centered">
              <div className="column is-half">
                <TopMessage />
              </div>
            </div>

            <div className="columns is-centered">
              <div className="column is-4">
                <PricingCard
                  title="Free Plan"
                  price="$0"
                  benefits={[
                    '100 flashcards and max upload (100mb)'
                  ]}
                />
              </div>
              <div className="column is-4">
                <PricingCard price="$2" title="Subscriber Plan" benefits={['Unlimited Flashcards (9GB++)']}
                             link={subcribeLink} linkText="Subscribe" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
