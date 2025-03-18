import { PageContainer } from '../../components/styled';
import { getVisibleText } from '../../lib/text/getVisibleText';
import { getLifetimeLink, getSubscribeLink } from './payment.links';
import { PricingCard } from './components/PricingCard';
import TopMessage from '../../components/TopMessage/TopMessage';

interface PricingPageProps {
  isLoggedIn: boolean;
}

export default function PricingPage({
  isLoggedIn,
}: Readonly<PricingPageProps>) {
  const subcribeLink = isLoggedIn ? getSubscribeLink() : '/login';
  const lifetimeLink = getLifetimeLink();

  return (
    <PageContainer>
      <div className="container content">
        <section className="section">
          <div className="container">
            <h1 className="title has-text-centered">
              {getVisibleText('pricing.page.title')}
            </h1>
            <div className="columns is-centered">
              <div className="column is-half">
                <TopMessage />
              </div>
            </div>

            <div className="mb-6">
              <p className="subtitle">
                Choose the plan that works best for you. Our monthly
                subscription can be canceled at any time, while our lifetime
                access offers a one-time payment solution with no recurring
                fees.
              </p>
            </div>

            <div className="columns is-centered">
              <div className="column is-4">
                <PricingCard
                  title="Free Plan"
                  price="$0"
                  benefits={['100 flashcards and max upload (100mb)']}
                />
              </div>
              <div className="column is-4">
                <PricingCard
                  price="$2"
                  title="Subscriber Plan - Monthly"
                  benefits={[
                    'Unlimited Flashcards (9GB++)',
                    'PDF support using Vertex AI',
                    'Cancel anytime - no commitment required',
                  ]}
                  link={subcribeLink}
                  linkText="Subscribe"
                />
              </div>
              <div className="column is-4">
                <PricingCard
                  price="$96"
                  title="Lifetime Access"
                  benefits={[
                    'Forever premium access to 2anki.net',
                    'PDF support using Vertex AI',
                    'One-time payment - no subscription needed',
                  ]}
                  link={lifetimeLink}
                  linkText="Contact us"
                />
              </div>
            </div>

            <div className="has-text-centered mt-5">
              <p>
                Lifetime access is available by application only. Please contact{' '}
                <a href="mailto:support@2anki.net">support@2anki.net</a> to
                apply.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
