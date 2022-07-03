import BecomeAPatron from '../../../components/BecomeAPatron';

export function ImposedLimits() {
  return (
    <div className="box">
      <div className="content">
        <h2>Imposed limitations</h2>
        <p>
          We have set quota limits on non-patrons to avoid increasing server
          load. The limitations are:
        </p>
        <ul>
          <li>
            You can only make conversions totalling 21MB but this is not
            permanent. You can for example delete previous uploads to reclaim
            your space when using it all up.
          </li>
          <li>
            You can only convert at most 21 subpages (applies to database
            entries as well) per conversion job.
          </li>
          <li>
            Max 1 conversion job but you can start new ones as soon as the last
            one is completed.
          </li>
          <li>You can only load 21 blocks total per page.</li>
        </ul>
        <p>
          If you want the limits removed you can do so by becoming a patron and
          they will removed for your account.
        </p>
        <strong>
          Please note depending on when you signed up it might take up to 24
          hours provide you access, please be patient.
        </strong>
      </div>
      <BecomeAPatron />
    </div>
  );
}

export default ImposedLimits;
