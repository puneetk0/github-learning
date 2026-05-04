import React from 'react';
import ConfigSimulator from '../components/ConfigSimulator';
import GitIgnoreBuilder from '../components/GitIgnoreBuilder';
import Callout from '../components/ui/Callout';
import CodeBlock from '../components/ui/CodeBlock';
import DeepDive from '../components/ui/DeepDive';
import Tabs from '../components/ui/Tabs';
import CommandTable from '../components/ui/CommandTable';
import WarningBox from '../components/ui/WarningBox';

export default function Setup() {
  return (
    <div className="page-content">
      <section className="section">
        <div className="section-header-wrap">
          <div className="section-bg-num">02</div>
          <div className="section-label">Introduction</div>
          <h2 id="git-config" className="section-title">Setup & Configuration</h2>
          <p className="section-desc">
            Mastering the configuration scopes, SSH authentication, GPG commit signing, and building bulletproof ignore rules.
          </p>
        </div>

        <Tabs tabs={[
          {
            label: "Config Scopes",
            content: (
              <>
                <p className="body-text">
                  Git configuration is hierarchical. It cascades down through three scopes. A lower-level scope always overrides a higher-level one.
                </p>
                <CommandTable rows={[
                  { flag: '--system', effect: 'Applies to all users on the OS. File lives at /etc/gitconfig. Rarely used unless managing a server.' },
                  { flag: '--global', effect: 'Applies to your user account. File lives at ~/.gitconfig. Where your personal email/name go.' },
                  { flag: '--local', effect: 'Applies only to the current repo. File lives at .git/config inside the repo. Overrides global settings (e.g. setting a work email for a specific repo).' }
                ]} />
                <p className="body-text">
                  <strong>The Identity Trap:</strong> Git bakes your name and email into every commit hash. If you commit with the wrong email, you cannot fix it without rewriting history (changing the hash of that commit and all subsequent commits). Set this up immediately.
                </p>
              </>
            )
          },
          {
            label: "Conditional Includes",
            content: (
              <>
                <p className="body-text">
                  If you use one laptop for both work and personal projects, managing your <code>user.email</code> is a nightmare. Instead of setting <code>--local</code> on every single repo, use <strong>Conditional Includes</strong> in your global <code>~/.gitconfig</code>.
                </p>
                <CodeBlock language="ini" code={`# Inside ~/.gitconfig

# Default to personal profile
[user]
    name = Jane Doe
    email = jane.personal@gmail.com

# If the repo is inside ~/work/, use the work config file instead
[includeIf "gitdir:~/work/"]
    path = ~/work/.gitconfig-work`} />
                <p className="body-text">
                  Then, in <code>~/work/.gitconfig-work</code>, you just put:
                </p>
                <CodeBlock language="ini" code={`[user]
    email = jane.doe@megacorp.com`} />
              </>
            )
          },
          {
            label: "Core Aliases",
            content: (
              <>
                <p className="body-text">
                  Senior engineers don't type <code>git commit</code> or <code>git checkout</code>. They use aliases. Add these to your <code>~/.gitconfig</code>:
                </p>
                <CodeBlock language="ini" code={`[alias]
    st = status -s
    co = checkout
    sw = switch
    ci = commit
    br = branch
    
    # The holy grail of aliases - visual commit graph
    lg = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(auto)%d%C(reset)' --all
    
    # Emergency save
    wip = !git add -A && git commit -m "WIP: checkpoint"`} />
              </>
            )
          }
        ]} />

        <ConfigSimulator />

        <div className="divider"></div>

        <h3 id="git-clone" className="subsection-title">Authentication: SSH vs HTTPS</h3>
        <p className="body-text">
          Never use HTTPS for daily git operations. HTTPS requires managing Personal Access Tokens (PATs) which expire and must be copy-pasted. SSH uses asymmetric cryptography.
        </p>

        <DeepDive title="Ed25519 vs RSA Cryptography">
          <p>
            Older tutorials tell you to run <code>ssh-keygen -t rsa -b 4096</code>. <strong>Do not do this anymore.</strong>
          </p>
          <p>
            RSA is slow, mathematically complex, and requires massive 4096-bit keys to remain secure against modern factorization algorithms. 
          </p>
          <p>
            Instead, use <strong>Ed25519</strong>, an elliptic curve signature scheme. It is faster, generates tiny keys (68 characters), and is significantly more secure.
          </p>
          <CodeBlock language="bash" code={`# The modern standard for generating GitHub keys
ssh-keygen -t ed25519 -C "your_email@example.com"`} />
        </DeepDive>

        <h3 className="subsection-title">GPG Commit Signing</h3>
        <p className="body-text">
          Because Git is a decentralized protocol, anyone can set their <code>user.name</code> and <code>user.email</code> to anything. I can configure my local Git to pretend I am Linus Torvalds, commit code, and push it. 
        </p>
        <p className="body-text">
          To prove a commit actually came from you, you must cryptographically sign it using a GPG (GNU Privacy Guard) key, or more modernly, an SSH signing key. GitHub will display a green <strong>Verified</strong> badge next to signed commits.
        </p>

        <CodeBlock language="bash" code={`# Tell git to use your SSH key for signing (Git 2.34+)
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# Auto-sign all commits
git config --global commit.gpgsign true`} />

        <div className="divider"></div>

        <h3 className="subsection-title">Mastering .gitignore</h3>
        <p className="body-text">
          <code>.gitignore</code> uses <strong>glob patterns</strong>. The rules of globbing in git are specific and powerful.
        </p>

        <CommandTable rows={[
          { flag: 'logs/', effect: 'Ignores the directory "logs" and everything inside it, anywhere in the repo.' },
          { flag: '/logs', effect: 'Ignores the "logs" file or directory ONLY at the root of the repository.' },
          { flag: '*.log', effect: 'Ignores all files ending in .log.' },
          { flag: '!important.log', effect: 'The exclamation mark NEGATES a previous rule. *.log is ignored, but important.log is tracked.' },
          { flag: '**/debug/**', effect: 'The double asterisk matches zero or more directories. Matches logs/debug/a.txt, src/main/debug/b.txt, etc.' }
        ]} />

        <WarningBox type="warning" title="The Tracked File Trap">
          <p>
            If you commit a file (e.g., <code>.env</code>) and push it, and THEN add it to <code>.gitignore</code>, <strong>Git will completely ignore the .gitignore rule</strong>. 
          </p>
          <p>
            <code>.gitignore</code> only prevents <em>untracked</em> files from being added. If a file is already in the Git index, you must manually remove it from the index first:
          </p>
          <CodeBlock language="bash" code={`git rm --cached .env
git commit -m "chore: stop tracking .env"`} />
        </WarningBox>

        <GitIgnoreBuilder />

      </section>
    </div>
  );
}
