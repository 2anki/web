import styled from 'styled-components';

export const StyledButton = styled.a`
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    background: #5397f5;
    padding: 1rem 1.9rem;
    border-radius: 3px;
    text-transform: uppercase;
    width: 268px;
    height: 66px;
    display: flex;
    grid-gap: 0.7rem;
    align-items: center;
    justify-content: center;

    text-decoration: none;
    color: white;

    &:hover {
        background-color: #2b2e3c;
        color: white;
    }


    /* Typography */
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    font-style: normal;
    font-weight: var(--font-semibold);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-normal);
    text-align: center;

    @media (max-width: 1024px) {
        font-size: var(--text-base);
        height: 54px;
        margin-right: auto;
    }
`;
