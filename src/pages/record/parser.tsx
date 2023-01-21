const parser = (data: any) => {
  if (data.type === 'text') {
    return (
      <p className="recordPage__content-item recordPage__content-paragraph">
        {data.content}
      </p>
    );
  }

  if (data.type === 'picture') {
    return (
      <div className="recordPage__content-item recordPage__content-picture">
        <picture>
          <source srcSet={data.content} type="image/webp" />
          <img
            loading="lazy"
            src={data.content}
            width="100%"
            height="100%"
            alt="Cover"
          />
        </picture>
      </div>
    );
  }

  if (data.type === 'link') {
    return (
      <a
        className="plugin__link"
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h3>{data.content} →</h3>
      </a>
    );
  }
};

export default parser;
