#!/usr/bin/env python3
"""
Smart CHANGELOG.md Updater
Analyzes git commits and creates a beautifully categorized changelog entry.
"""

import subprocess
import sys
import re
from datetime import datetime
from collections import defaultdict

# Category mappings with emojis
CATEGORIES = {
    'feat': {'name': '✨ Features', 'emoji': '✨'},
    'feature': {'name': '✨ Features', 'emoji': '✨'},
    'fix': {'name': '🐛 Bug Fixes', 'emoji': '🐛'},
    'bugfix': {'name': '🐛 Bug Fixes', 'emoji': '🐛'},
    'docs': {'name': '📚 Documentation', 'emoji': '📚'},
    'documentation': {'name': '📚 Documentation', 'emoji': '📚'},
    'style': {'name': '💅 Style', 'emoji': '💅'},
    'refactor': {'name': '♻️ Refactoring', 'emoji': '♻️'},
    'perf': {'name': '⚡ Performance', 'emoji': '⚡'},
    'performance': {'name': '⚡ Performance', 'emoji': '⚡'},
    'test': {'name': '🧪 Tests', 'emoji': '🧪'},
    'tests': {'name': '🧪 Tests', 'emoji': '🧪'},
    'chore': {'name': '🔧 Chores', 'emoji': '🔧'},
    'build': {'name': '🔨 Build', 'emoji': '🔨'},
    'ci': {'name': '👷 CI/CD', 'emoji': '👷'},
    'revert': {'name': '⏪ Reverts', 'emoji': '⏪'},
    'security': {'name': '🔒 Security', 'emoji': '🔒'},
}

# Default category for uncategorized commits
DEFAULT_CATEGORY = {'name': '📝 Other Changes', 'emoji': '📝'}


def run_git_command(cmd_list):
    """Run a git command and return the output."""
    try:
        result = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running git command: {' '.join(cmd_list)}", file=sys.stderr)
        if e.stderr:
            print(f"Error: {e.stderr}", file=sys.stderr)
        sys.exit(1)


def get_latest_tag():
    """Get the latest git tag."""
    try:
        # Fetch tags first
        subprocess.run(['git', 'fetch', '--tags', '--force'], 
                      capture_output=True, check=False)
        
        # Get latest tag
        result = subprocess.run(
            ['git', 'describe', '--tags', '--abbrev=0'],
            capture_output=True,
            text=True,
            check=False
        )
        if result.returncode == 0:
            return result.stdout.strip()
        return None
    except Exception:
        return None


def get_commits_since_tag(tag):
    """Get all commits since the given tag."""
    if tag:
        cmd = ['git', 'log', f'{tag}..HEAD', '--pretty=format:%H|%s|%b', '--no-merges']
    else:
        # If no tag, get all commits
        cmd = ['git', 'log', '--pretty=format:%H|%s|%b', '--no-merges']
    
    output = run_git_command(cmd)
    if not output:
        return []
    
    commits = []
    for line in output.split('\n'):
        if not line.strip():
            continue
        parts = line.split('|', 2)
        if len(parts) >= 2:
            commit_hash = parts[0]
            subject = parts[1]
            body = parts[2] if len(parts) > 2 else ''
            commits.append({
                'hash': commit_hash,
                'subject': subject,
                'body': body
            })
    
    return commits


def categorize_commit(commit):
    """Categorize a commit based on conventional commit format."""
    subject = commit['subject'].lower()
    
    # Check for conventional commit format: type(scope): description
    pattern = r'^(\w+)(?:\([^)]+\))?:'
    match = re.match(pattern, subject)
    
    if match:
        commit_type = match.group(1).lower()
        if commit_type in CATEGORIES:
            return commit_type
    
    # Check for keywords in subject
    for category, info in CATEGORIES.items():
        if category in subject:
            return category
    
    # Check for common patterns
    if any(word in subject for word in ['add', 'new', 'implement', 'create']):
        return 'feat'
    if any(word in subject for word in ['fix', 'bug', 'error', 'issue']):
        return 'fix'
    if any(word in subject for word in ['doc', 'readme', 'comment']):
        return 'docs'
    if any(word in subject for word in ['refactor', 'restructure', 'reorganize']):
        return 'refactor'
    if any(word in subject for word in ['test', 'spec']):
        return 'test'
    if any(word in subject for word in ['style', 'format', 'lint']):
        return 'style'
    if any(word in subject for word in ['perf', 'performance', 'optimize', 'speed']):
        return 'perf'
    if any(word in subject for word in ['chore', 'bump', 'update', 'upgrade']):
        return 'chore'
    
    return 'other'


def format_commit_message(commit):
    """Format a commit message for the changelog."""
    subject = commit['subject']
    
    # Remove type prefix if present (e.g., "feat: " or "fix(scope): ")
    subject = re.sub(r'^\w+(?:\([^)]+\))?:\s*', '', subject, flags=re.IGNORECASE)
    
    # Capitalize first letter
    if subject:
        subject = subject[0].upper() + subject[1:]
    
    # Get short hash
    short_hash = commit['hash'][:7]
    
    return f"- {subject} ({short_hash})"


def parse_existing_changelog():
    """Parse existing CHANGELOG.md and return its content structure."""
    try:
        with open('CHANGELOG.md', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the Unreleased section
        unreleased_match = re.search(
            r'## \[Unreleased\](.*?)(?=## |\Z)',
            content,
            re.DOTALL
        )
        
        unreleased_content = unreleased_match.group(1).strip() if unreleased_match else ''
        
        # Get everything before the Unreleased section
        if unreleased_match:
            before_unreleased = content[:unreleased_match.start()]
        else:
            before_unreleased = content
        
        return {
            'header': before_unreleased,
            'unreleased': unreleased_content
        }
    except FileNotFoundError:
        return {
            'header': '',
            'unreleased': ''
        }


def generate_changelog_entry(commits, new_tag):
    """Generate a changelog entry for the new tag."""
    if not commits:
        return "## [{}] - {}\n\n- No changes in this release.\n".format(
            new_tag,
            datetime.now().strftime('%Y-%m-%d')
        )
    
    # Categorize commits
    categorized = defaultdict(list)
    for commit in commits:
        category = categorize_commit(commit)
        categorized[category].append(commit)
    
    # Build the changelog entry
    lines = [
        f"## [{new_tag}] - {datetime.now().strftime('%Y-%m-%d')}",
        ""
    ]
    
    # Add commits by category in a specific order
    category_order = ['feat', 'fix', 'perf', 'refactor', 'docs', 'style', 'test', 'chore', 'build', 'ci', 'security', 'revert', 'other']
    
    for cat in category_order:
        if cat in categorized and categorized[cat]:
            info = CATEGORIES.get(cat, DEFAULT_CATEGORY)
            lines.append(f"### {info['name']}")
            lines.append("")
            for commit in categorized[cat]:
                lines.append(format_commit_message(commit))
            lines.append("")
    
    return '\n'.join(lines)


def write_changelog(new_tag, new_entry):
    """Write the updated CHANGELOG.md file."""
    existing = parse_existing_changelog()
    
    # Build the new changelog
    lines = []
    
    # Add header if it exists, otherwise create default
    if existing['header'].strip():
        lines.append(existing['header'].rstrip())
    else:
        lines.append("# Changelog")
        lines.append("")
        lines.append("All notable changes to this project will be documented in this file.")
        lines.append("")
        lines.append("The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),")
        lines.append("and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).")
        lines.append("")
    
    # Add Unreleased section
    lines.append("## [Unreleased]")
    lines.append("")
    lines.append("### Added")
    lines.append("- Nothing yet")
    lines.append("")
    
    # Add the new release entry
    lines.append(new_entry)
    lines.append("")
    
    # Write to file
    with open('CHANGELOG.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Error: Version tag required", file=sys.stderr)
        print("Usage: python update_changelog.py <version_tag>", file=sys.stderr)
        sys.exit(1)
    
    new_tag = sys.argv[1]
    
    # Validate tag format
    if not re.match(r'^v?\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$', new_tag):
        print(f"Warning: Tag '{new_tag}' doesn't match standard version format", file=sys.stderr)
    
    print(f"📝 Analyzing commits for {new_tag}...")
    
    # Get latest tag
    latest_tag = get_latest_tag()
    if latest_tag:
        print(f"   Found previous tag: {latest_tag}")
    else:
        print("   No previous tags found, analyzing all commits")
    
    # Get commits since last tag
    commits = get_commits_since_tag(latest_tag)
    print(f"   Found {len(commits)} commit(s) to include")
    
    # Generate changelog entry
    new_entry = generate_changelog_entry(commits, new_tag)
    
    # Write changelog
    write_changelog(new_tag, new_entry)
    
    print(f"✅ CHANGELOG.md updated successfully!")
    print(f"   Added release section: [{new_tag}]")
    print(f"   Categorized {len(commits)} commit(s) into meaningful sections")


if __name__ == '__main__':
    main()
