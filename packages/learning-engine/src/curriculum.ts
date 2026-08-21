import type {AdventureSave} from './types';
import {touchSave} from './state';

export function completeCurriculumLesson(save: AdventureSave, lessonId: string): AdventureSave {
  if (save.curriculum.completedLessonIds.includes(lessonId)) return save;
  return touchSave({...save, curriculum: {...save.curriculum, completedLessonIds: [...save.curriculum.completedLessonIds, lessonId]}});
}

export function curriculumLessonComplete(save: AdventureSave, lessonId: string) {
  return save.curriculum.completedLessonIds.includes(lessonId);
}
