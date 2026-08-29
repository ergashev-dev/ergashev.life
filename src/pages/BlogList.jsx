import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTelegraphPageList } from '../utils/telegraph';
import useSEO from '../hooks/useSEO';

const BlogList = () => {
  const [blogsByYearMonth, setBlogsByYearMonth] = useState({});
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useSEO({
    title: 'Blog',
    description: 'Explore articles, tutorials, and tech insights by Abdulbosit Alijonov.',
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [loading]);

  useEffect(() => {
    let isMounted = true;

    const groupPages = (pages) => {
      const grouped = {};
      pages.forEach((page) => {
        const pathParts = page.path.split('-');
        let month = new Date().toLocaleString('en-US', { month: 'long' });
        let year = new Date().getFullYear().toString();
        let dateFormatted = `${new Date().getDate().toString().padStart(2, '0')} ${month}, ${year}`;

        if (pathParts.length >= 2) {
          const possibleMonth = parseInt(pathParts[pathParts.length - 2]);
          const possibleDay = parseInt(pathParts[pathParts.length - 1]);
          if (!isNaN(possibleMonth) && possibleMonth >= 1 && possibleMonth <= 12) {
            const date = new Date();
            date.setMonth(possibleMonth - 1);
            month = date.toLocaleString('en-US', { month: 'long' });
            if (!isNaN(possibleDay)) {
              dateFormatted = `${possibleDay.toString().padStart(2, '0')} ${month}, ${year}`;
            }
          }
        }

        if (!grouped[year]) grouped[year] = {};
        if (!grouped[year][month]) grouped[year][month] = [];

        grouped[year][month].push({
          id: page.path,
          slug: page.path,
          title: page.title,
          description: page.description,
          dateFormatted,
        });
      });
      return grouped;
    };

    const fetchPosts = async () => {
      try {
        const pages = await getTelegraphPageList((freshPages) => {
          if (isMounted && freshPages) {
            setBlogsByYearMonth(groupPages(freshPages));
          }
        });

        if (isMounted && pages) {
          setBlogsByYearMonth(groupPages(pages));
        }
      } catch (error) {
        console.error('Error fetching Telegraph posts:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const years = Object.keys(blogsByYearMonth).sort((a, b) => b - a);

  return (
    <>
      <section className="section-title">
        <div className="container">
          <div className="section-content">
            <h1>Blog</h1>
          </div>
        </div>
      </section>

      <section className="flex align-items-start" style={{ minHeight: '80vh' }}>
        <div className="container">
          <div className="row justify-between align-top">
            <div id="archive" className="col-md-7">
              {loading ? (
                /* Skeleton Loader for Blog List */
                <div className="blog-list-skeleton">
                  <div className="skeleton" style={{ width: '90px', height: '28px', marginBottom: '25px' }}></div>
                  <div className="skeleton" style={{ width: '130px', height: '22px', marginBottom: '18px' }}></div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="skeleton-list-item" style={{ marginBottom: '22px' }}>
                      <div className="skeleton" style={{ width: '110px', height: '14px', marginBottom: '8px' }}></div>
                      <div className="skeleton" style={{ width: `${Math.min(95, 60 + i * 8)}%`, height: '20px' }}></div>
                    </div>
                  ))}
                </div>
              ) : years.length > 0 ? (
                years.map((year) => (
                  <React.Fragment key={year}>
                    <h4 className="sticky">{year}</h4>
                    {Object.keys(blogsByYearMonth[year]).map((month) => (
                      <React.Fragment key={month}>
                        <h4>{month}</h4>
                        <ul className="list-wrapper">
                          {blogsByYearMonth[year][month].map((blog) => (
                            <li key={blog.id}>
                              <Link className="list-item" to={`/blog/${blog.slug}`}>
                                <div className="date">{blog.dateFormatted}</div>
                                <div
                                  className="title"
                                  dangerouslySetInnerHTML={{ __html: blog.title }}
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <div
                  className="no-blogs-message"
                  style={{
                    padding: '30px 15px',
                    fontWeight: '500',
                    textAlign: 'center',
                    color: '#666',
                  }}
                >
                  There are no published blogs yet.
                </div>
              )}
            </div>

            <div
              className="subscribe-form col-md-4 sticky"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form"
            >
              <h6>Subscribe</h6>
              <p>
                You can find my latest articles, lectures, and lessons on my Telegram channel{' '}
                <a
                  href="https://t.me/abdulbosit_alijonov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @abdulbosit_alijonov
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="progress-bar">
        <div className="bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>
    </>
  );
};

export default BlogList;

