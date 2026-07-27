import { useState, useMemo } from 'react';

export default function CronBuilder() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  const cronString = useMemo(() => {
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const explanation = useMemo(() => {
    // human readable simple cron translation
    if (cronString === '* * * * *') return 'Runs every single minute of every day.';
    if (cronString === '*/5 * * * *') return 'Runs once every 5 minutes.';
    if (cronString === '0 * * * *') return 'Runs once at the start of every hour.';
    if (cronString === '0 0 * * *') return 'Runs daily at midnight.';
    if (cronString === '0 0 * * 0') return 'Runs weekly at midnight every Sunday.';

    const descParts = [];
    if (minute === '0' && hour === '0') descParts.push('at midnight');
    else if (minute === '0' && hour !== '*') descParts.push(`at hour ${hour}:00`);
    else descParts.push(`minute ${minute} of hour ${hour}`);

    if (dayOfMonth !== '*') descParts.push(`on day of month ${dayOfMonth}`);
    if (month !== '*') descParts.push(`in month ${month}`);
    if (dayOfWeek !== '*') descParts.push(`on day of week ${dayOfWeek}`);

    return `Runs: ${descParts.join(', ')}.`;
  }, [cronString, minute, hour, dayOfMonth, month, dayOfWeek]);

  return (
    <div className="tool-container">
      <h2 className="tool-title">Cron Expression Builder & Reader</h2>
      <p className="tool-desc">Quickly configure, validate, and translate standard crontab timing strings.</p>

      <div className="editor-grid">
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="panel-title">Scheduler Controls</h3>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Minute:</label>
            <select value={minute} onChange={(e) => setMinute(e.target.value)}>
              <option value="*">Every minute (*)</option>
              <option value="*/5">Every 5 minutes (*/5)</option>
              <option value="*/15">Every 15 minutes (*/15)</option>
              <option value="0">At start of hour (0)</option>
            </select>
          </div>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Hour:</label>
            <select value={hour} onChange={(e) => setHour(e.target.value)}>
              <option value="*">Every hour (*)</option>
              <option value="0">Midnight (00:00)</option>
              <option value="12">Noon (12:00)</option>
              <option value="8">Morning (08:00)</option>
            </select>
          </div>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Day of Month:</label>
            <select value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)}>
              <option value="*">Every day (*)</option>
              <option value="1">1st day of month (1)</option>
              <option value="15">15th day of month (15)</option>
            </select>
          </div>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Month:</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="*">Every month (*)</option>
              <option value="1">January (1)</option>
              <option value="6">June (6)</option>
              <option value="12">December (12)</option>
            </select>
          </div>

          <div className="control-group" style={{ justifyContent: 'space-between' }}>
            <label>Day of Week:</label>
            <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
              <option value="*">Every day of week (*)</option>
              <option value="0">Sunday (0)</option>
              <option value="1">Monday (1)</option>
              <option value="5">Friday (5)</option>
            </select>
          </div>
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 className="panel-title">Timing Output</h3>

          <div className="sidebar-search" style={{ margin: 0 }}>
            <input
              type="text"
              readOnly
              style={{ fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold' }}
              value={cronString}
            />
            <button
              className="btn btn-sm btn-secondary"
              style={{ position: 'absolute', right: 6, top: 4 }}
              onClick={() => navigator.clipboard.writeText(cronString)}
            >
              Copy
            </button>
          </div>

          <div className="jwt-expiry-banner active" style={{ marginTop: 12 }}>
            💡 {explanation}
          </div>
        </div>
      </div>
    </div>
  );
}
