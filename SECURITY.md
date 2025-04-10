# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

We take the security of Figma Code Comparator seriously. If you believe you have found a security vulnerability, please follow these steps:

1. **DO NOT** disclose the vulnerability publicly
2. Send a detailed report to [security@your-domain.com] including:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- Initial response: Within 48 hours
- Status update: Every 72 hours
- Fix timeline: Based on severity
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: Next release

## Security Considerations

When using the Figma Code Comparator:

1. **API Keys & Tokens**
   - Never commit API keys or tokens
   - Use environment variables
   - Rotate keys regularly

2. **Browser Extension**
   - Only install from official Chrome Web Store
   - Keep extension updated
   - Review permissions carefully

3. **Data Security**
   - No design data is stored externally
   - All comparisons happen locally
   - Screenshots are temporary

## Best Practices

1. **Development**
   - Keep dependencies updated
   - Run security audits: `npm audit`
   - Follow secure coding guidelines

2. **Deployment**
   - Use HTTPS only
   - Enable CSP headers
   - Implement proper CORS policies

3. **Usage**
   - Use latest browser version
   - Enable security features
   - Report suspicious behavior

## Security Updates

Security updates will be:
1. Released as patch versions
2. Documented in CHANGELOG.md
3. Tagged with "security" label
4. Announced in release notes

## Contact

For security concerns, contact:
- Email: [security@your-domain.com]
- Response time: 48 hours
- Encryption: GPG key available 