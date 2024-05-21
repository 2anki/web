import { PageContainer } from '../../components/styled';
import { getVisibleText } from '../../lib/text/getVisibleText';
import { getSubscribeLink } from './getSubscribeLink';
import { PricingCard } from './components/PricingCard';

export default function PricingPage() {
  const patreonLink = 'https://alemayhu.com/patreon';

  return (
    <PageContainer>
      <div className="container content">
        <section className="section">
          <div className="container">
            <h1 className="title has-text-centered">{getVisibleText('pricing.page.title')}</h1>

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
                <PricingCard price="€2" title="Subscriber Plan" benefits={['Unlimited Flashcards but limited uploads']}
                             link={getSubscribeLink()} linkText="Subscribe" />
              </div>

              <div className="column is-4">
                <PricingCard price="€28.50" title="Patreon membership" benefits={['Unlimited conversions and uploads']}
                             link={patreonLink} linkText="Join" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
