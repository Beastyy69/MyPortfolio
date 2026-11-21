/**
 * Projects section — real projects only (src/data/projects.js, verified from GitHub).
 *   AI mode   → <ProjectEcosystem />: Hologram With AI as the flagship centrepiece,
 *               the other projects as connected modules with a focused panel.
 *   Game mode → <MissionOutpost />: a Code Frontier territory map where each
 *               project is a place; selecting one opens its mission scene.
 */
import { useMode } from '../../context/ModeContext.jsx';
import Chapter from '../ui/Chapter.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import ProjectEcosystem from '../projects/ProjectEcosystem.jsx';
import MissionOutpost from '../game/MissionOutpost.jsx';

export default function Projects() {
  const { isRetro } = useMode();
  return (
    <Chapter id="projects" ghost="Selected work" retroGhost="MISSIONS" className="projects" labelledBy="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          index="03"
          eyebrow="Project ecosystem"
          retroEyebrow="MISSION OUTPOST"
          title="Real builds, one connected system."
          retroTitle="The project territory"
          intro="Every project here is open on GitHub. Hologram With AI is the flagship; the rest connect to it as supporting builds."
          retroIntro="Each project is a place in Code Frontier. Start at the Observatory — the flagship — then follow the routes to every outpost."
        />
        {isRetro ? <MissionOutpost /> : <ProjectEcosystem />}
      </div>
    </Chapter>
  );
}
