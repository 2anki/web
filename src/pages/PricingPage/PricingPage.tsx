import { PageContainer } from '../../components/styled';
import { getVisibleText } from '../../lib/text/getVisibleText';

export default function PricingPage() {
  const subscribeLink = 'https://buy.stripe.com/eVadTGcCI6Ny73qfZ0';
  const patreonLink = 'https://alemayhu.com/patreon';

  return (
    <PageContainer>
      <div className="container content">
        <section className="section">
          <div className="container">
            <h1 className="title has-text-centered">{getVisibleText('pricing.page.title')}</h1>

            <div className="columns is-centered">
              <div className="column is-4">
                <div className="card">
                  <div className="card-header">
                    <p className="card-header-title">
                      €2 / Subscriber Plan
                    </p>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <ul>
                        <li>Unlimited Flashcards (100mb)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-footer">
                    <a href={subscribeLink} className="card-footer-item button is-link">
                      Subscribe
                    </a>
                  </div>
                </div>
              </div>

              <div className="column is-4">
                <div className="card">
                  <div className="card-header">
                    <p className="card-header-title">
                      €28.50
                      Patreon membership
                    </p>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <ul>
                        <li>Unlimited conversions (9GB++)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-footer">
                    <a href={patreonLink} className="card-footer-item button is-link">
                      Join
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
